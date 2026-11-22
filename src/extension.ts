import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('aiProjectAuditor.scan', async () => {
        
        const excludePattern = '**/{node_modules,.git,out,dist,build,.audit}/**';
        const allFiles = await vscode.workspace.findFiles('**/*', excludePattern);
        const validExtensions = [
			'.ts', '.js', '.jsx', '.tsx', // Web
			'.py',                        // Python
			'.cpp', '.h', '.hpp', '.c', '.cs', // C/C++/C#
			'.java', '.kt', '.scala',     // JVM
			'.rs', '.go', '.rb', '.php',  // Otros
			'.swift', '.m',               // Apple
			'.sh', '.bash', '.sql', '.lua', '.dart' // Extra
		];
        const codeFiles = allFiles.filter(file => validExtensions.includes(path.extname(file.fsPath).toLowerCase()));

        if (codeFiles.length === 0) {
            vscode.window.showWarningMessage('No se encontraron archivos de código válidos.');
            return;
        }

        const auditData: any[] = [];
        let totalErrors = 0;
        let totalWarnings = 0;

        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Auditando archivos",
            cancellable: true
        }, async (progress, token) => {
            let count = 0;
            const total = codeFiles.length;
            const increment = 100 / total;

            for (const file of codeFiles) {
                if (token.isCancellationRequested) {
                    break;
                }

                const fileName = path.basename(file.fsPath);
                progress.report({ increment: increment, message: `${count + 1}/${total} - ${fileName}` });

                try {
                    const document = await vscode.workspace.openTextDocument(file);
                    await new Promise(resolve => setTimeout(resolve, 300));
                    const diagnostics = vscode.languages.getDiagnostics(document.uri);
                    
                    const fileErrors = diagnostics.filter(d => d.severity === vscode.DiagnosticSeverity.Error);
                    const fileWarnings = diagnostics.filter(d => d.severity === vscode.DiagnosticSeverity.Warning);
                    
                    totalErrors += fileErrors.length;
                    totalWarnings += fileWarnings.length;

                    // NUEVO: Si hay errores, guardamos TODO el código del archivo
                    let fullCode = "";
                    if (fileErrors.length > 0) {
                        fullCode = document.getText();
                    }

                    auditData.push({
                        file: path.basename(file.fsPath),
                        relativePath: path.relative(vscode.workspace.workspaceFolders![0].uri.fsPath, file.fsPath),
                        errors: fileErrors.length,
                        warnings: fileWarnings.length,
                        fullCode: fullCode, // Guardamos el código completo aquí
                        diagnostics: diagnostics.map(d => ({
                            message: d.message,
                            line: d.range.start.line + 1,
                            severity: d.severity === vscode.DiagnosticSeverity.Error ? 'Error' : 'Warning'
                        }))
                    });
                } catch (e) {
                    console.error(`Error procesando ${fileName}:`, e);
                }
                count++;
            }
        });

        if (vscode.workspace.workspaceFolders) {
            const rootPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
            const projectName = path.basename(rootPath);
            const auditDir = path.join(rootPath, '.audit');
            
            try {
                await vscode.workspace.fs.createDirectory(vscode.Uri.file(auditDir));
                
                // 1. Guardar JSON
                await vscode.workspace.fs.writeFile(
                    vscode.Uri.file(path.join(auditDir, 'audit.json')), 
                    Buffer.from(JSON.stringify(auditData, null, 2), 'utf8')
                );

                // 2. Crear el Markdown
                let mdContent = `# Índice de Auditoría: ${projectName}\n\n`;
                mdContent += `**Resumen:** Se analizaron ${auditData.length} archivos de código.\n`;
                mdContent += `**Estado Global:** ${totalErrors} Errores, ${totalWarnings} Advertencias.\n\n`;
                mdContent += `## Archivos con Errores (Código Completo)\n\n`;
                
                // Ordenar por los que tienen más errores
                auditData.sort((a, b) => b.errors - a.errors);

                for (const data of auditData) {
                    if (data.errors === 0) {
    					continue; // Solo mostrar archivos con errores en el Markdown
					}// Solo mostrar archivos con errores en el Markdown

                    mdContent += `### ${data.relativePath}\n`;
                    mdContent += `- **Errores:** ${data.errors} | **Advertencias:** ${data.warnings}\n`;
                    
                    if (data.diagnostics.length > 0) {
                        mdContent += `\n**Problemas detectados:**\n`;
                        for (const diag of data.diagnostics) {
                            mdContent += `- [Línea ${diag.line}] (${diag.severity}): ${diag.message}\n`;
                        }
                    }
                    
                    // Imprimir el código completo del archivo
                    if (data.fullCode) {
                        const ext = path.extname(data.file).replace('.', '');
                        mdContent += `\n**Código completo del archivo:**\n\`\`\`${ext}\n${data.fullCode}\n\`\`\`\n`;
                    }
                    
                    mdContent += `\n---\n\n`;
                }

                const mdUri = vscode.Uri.file(path.join(auditDir, 'INDEX.md'));
                await vscode.workspace.fs.writeFile(mdUri, Buffer.from(mdContent, 'utf8'));

                // 3. Ofrecer copiar al portapapeles
                const action = await vscode.window.showInformationMessage(
                    `¡Auditoría lista! Errores: ${totalErrors}, Advertencias: ${totalWarnings}`,
                    'Copiar INDEX.md a la IA'
                );

                if (action === 'Copiar INDEX.md a la IA') {
                    await vscode.env.clipboard.writeText(mdContent);
                    vscode.window.showInformationMessage('¡Contexto con código completo copiado! Pégalo en tu chat de IA.');
                }

            } catch (error) {
                vscode.window.showErrorMessage(`Error al guardar el reporte: ${error}`);
            }
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}