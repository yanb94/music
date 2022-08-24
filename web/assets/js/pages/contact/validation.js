import * as yup from "yup";

const schemaValidation = yup.object().shape({
    firstname: yup.string()
        .required("Vous devez entrez un prénom")
        .min(2, 'Votre prénom doit compter au moins ${min} caractères')
        .max(50, 'Votre prénom ne doit pas compter plus de ${max} caractères')
        .matches(/^[ a-zA-ZàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ'`'\-]+$/, "Votre prénom ne doit pas contenir de caractère spéciaux"),
    lastname: yup.string()
        .required("Vous devez entrez un nom")
        .min(2, 'Votre nom de famille doit compter au moins ${min} caractères')
        .max(50, 'Votre nom de famille ne doit pas compter plus de ${max} caractères')
        .matches(/^[ a-zA-ZàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ'`'\-]+$/, "Votre nom ne doit pas contenir de caractère spéciaux"),
    email: yup.string()
      .required("Vous devez indiquer un email")
      .email("Vous devez indiquer un email"),
    message: yup.string()
        .required("Vous devez indiquer un message")
        .min(10, 'Votre message doit compter au moins ${min} caractères')
        .max(400, 'Votre message ne doit pas compter plus de ${max} caractères')
});

export default schemaValidation;