import * as yup from "yup";

const schemaValidation = yup.object().shape({
	name: yup
		.string()
		.required("Vous devez indiquer un nom d'artiste")
		.min(2, "Votre nom d'artiste doit compter au moins ${min} caractères")
		.max(
			50,
			"Votre nom d'artiste ne doit pas compter plus de ${max} caractères"
		)
		.matches(
			/^[ 0-9a-zA-ZàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ'`'\-]+$/,
			"Votre nom d'artiste ne doit pas contenir de caractères spéciaux"
		),
	email: yup
		.string()
		.required("Vous devez indiquer un email de paiement")
		.email("Vous devez indiquer un email de paiement"),
	email_confirm: yup
		.string()
		.oneOf([yup.ref("email")], "Vous indiquer un email identique"),
	description: yup
		.string()
		.required("Vous devez indiquer une description")
		.min(20, "Votre description doit compter au moins ${min} caractères")
		.max(
			250,
			"Votre description ne doit pas compter plus de ${max} caractères"
		),
	image: yup
		.mixed()
		.required("Vous devez indiquer un avatar")
		.test("type", "Vous devez indiquer une image", (value) => {
			return (
				value && ["image/jpeg", "image/png"].includes(value[0]?.type)
			);
		})
		.test("size", "Votre image doit faire moins de 2 Mo", (value) => {
			return value && value[0]?.size <= 2000000;
		}),
});

export default schemaValidation;
