import { buildEmailLayout } from './email-layout.js';

export const templateValidateEmail = (name, link) =>
	buildEmailLayout({
		preview: 'Confirma tu correo para activar tu cuenta en CalendarApp.',
		title: 'Confirma tu correo electrónico',
		greeting: name,
		paragraphs: [
			'Gracias por registrarte en CalendarApp. Solo falta un paso para activar tu cuenta y empezar a organizar tus eventos y equipos.',
			'Haz clic en el botón para verificar tu dirección de correo. El enlace es personal y de un solo uso.',
		],
		buttonLabel: 'Verificar mi cuenta',
		link,
		footerNote:
			'Este enlace caduca por seguridad. Si no creaste una cuenta en CalendarApp, no necesitas hacer nada: tu correo no quedará verificado.',
	});
