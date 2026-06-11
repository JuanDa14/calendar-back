import { buildEmailLayout } from './email-layout.js';

export const templateForgotPassword = (name, link) =>
	buildEmailLayout({
		preview: 'Restablece tu contraseña de CalendarApp con este enlace seguro.',
		title: 'Restablece tu contraseña',
		greeting: name,
		paragraphs: [
			'Recibimos una solicitud para restablecer la contraseña de tu cuenta en CalendarApp.',
			'Si fuiste tú, usa el botón de abajo para elegir una nueva contraseña. El enlace es temporal y solo podrá usarse una vez.',
		],
		buttonLabel: 'Crear nueva contraseña',
		link,
		footerNote:
			'Si no solicitaste este cambio, ignora este correo. Tu contraseña actual seguirá siendo la misma y nadie más podrá acceder a tu cuenta.',
	});
