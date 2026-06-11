const APP_NAME = 'CalendarApp';

const styles = {
	body: 'margin:0;padding:0;background-color:#f4f4f5;font-family:Inter,Segoe UI,Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;',
	wrapper: 'width:100%;background-color:#f4f4f5;padding:32px 16px;',
	card: 'max-width:560px;margin:0 auto;background-color:#ffffff;border:1px solid #e4e4e7;border-radius:12px;overflow:hidden;',
	header: 'background-color:#18181b;padding:28px 32px;text-align:center;',
	logo: 'display:inline-block;width:40px;height:40px;line-height:40px;border-radius:10px;background-color:#fafafa;color:#18181b;font-size:18px;font-weight:700;text-decoration:none;',
	appName: 'margin:12px 0 0;color:#fafafa;font-size:18px;font-weight:600;letter-spacing:-0.02em;',
	content: 'padding:32px;color:#3f3f46;font-size:15px;line-height:1.6;',
	title: 'margin:0 0 16px;color:#18181b;font-size:22px;font-weight:600;line-height:1.3;letter-spacing:-0.02em;',
	greeting: 'margin:0 0 16px;color:#52525b;font-size:15px;',
	paragraph: 'margin:0 0 16px;color:#52525b;font-size:15px;line-height:1.6;',
	buttonWrap: 'margin:28px 0 8px;text-align:center;',
	button:
		'display:inline-block;padding:12px 28px;background-color:#18181b;color:#fafafa !important;text-decoration:none;font-size:15px;font-weight:600;border-radius:8px;',
	linkFallback: 'margin:20px 0 0;padding:16px;background-color:#f4f4f5;border-radius:8px;word-break:break-all;',
	linkText: 'margin:0 0 8px;color:#71717a;font-size:12px;',
	linkUrl: 'margin:0;color:#52525b;font-size:13px;line-height:1.5;',
	note: 'margin:24px 0 0;padding-top:20px;border-top:1px solid #e4e4e7;color:#71717a;font-size:13px;line-height:1.5;',
	footer: 'max-width:560px;margin:16px auto 0;text-align:center;color:#a1a1aa;font-size:12px;line-height:1.5;',
};

export const buildEmailLayout = ({
	preview,
	title,
	greeting,
 paragraphs = [],
	buttonLabel,
	link,
	footerNote,
}) => {
	const previewText = preview || title;
	const paragraphHtml = paragraphs.map((text) => `<p style="${styles.paragraph}">${text}</p>`).join('');

	return `<!DOCTYPE html>
<html lang="es">
<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<title>${title} · ${APP_NAME}</title>
	<!--[if mso]><style>body,table,td{font-family:Arial,sans-serif!important;}</style><![endif]-->
</head>
<body style="${styles.body}">
	<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${previewText}</div>
	<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="${styles.wrapper}">
		<tr>
			<td align="center">
				<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="${styles.card}">
					<tr>
						<td style="${styles.header}">
							<div style="${styles.logo}">C</div>
							<p style="${styles.appName}">${APP_NAME}</p>
						</td>
					</tr>
					<tr>
						<td style="${styles.content}">
							<h1 style="${styles.title}">${title}</h1>
							<p style="${styles.greeting}">Hola, <strong>${greeting}</strong></p>
							${paragraphHtml}
							<div style="${styles.buttonWrap}">
								<a href="${link}" target="_blank" rel="noopener noreferrer" style="${styles.button}">${buttonLabel}</a>
							</div>
							<div style="${styles.linkFallback}">
								<p style="${styles.linkText}">Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
								<p style="${styles.linkUrl}">${link}</p>
							</div>
							<p style="${styles.note}">${footerNote}</p>
						</td>
					</tr>
				</table>
				<p style="${styles.footer}">
					Has recibido este correo porque tienes una cuenta en ${APP_NAME}.<br />
					Si no reconoces esta acción, puedes ignorar este mensaje con tranquilidad.
				</p>
			</td>
		</tr>
	</table>
</body>
</html>`;
};
