import * as yup from "yup";
import { parse, isDate, subYears} from "date-fns";

function formatDate(date)
{
    const day = (date.split('-')[2]).split('T')[0]
    const month = date.split('-')[1]
    const year = date.split('-')[0]

    return year+"-"+month+"-"+day
}

function parseDateString(value, originalValue) {
    const parsedDate = isDate(originalValue)
      ? originalValue
      : parse(formatDate(originalValue), "yyyy-MM-dd", new Date());

    return parsedDate;
}

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
    birthday: yup.date()
      .transform(parseDateString)
      .typeError("Vous devez indiquer une date valide")
      .max(subYears(new Date(), 18),"Vous devez avoir au moins 18 ans"),
    sexe: yup.mixed()
      .required("Vous devez indiquer votre sexe")
      .oneOf(['f','m'], "Vous devez indiquer votre sexe"),
    email: yup.string()
      .required("Vous devez indiquer un email")
      .email("Vous devez indiquer un email identique"),
    email_confirm: yup.string()
      .oneOf([yup.ref('email')], "Vous indiquer un email identique"),
    username: yup.string()
      .required("Vous devez indiquer un nom d'utilisateur")
      .min(2, 'Votre nom d\'utilisateur doit compter au moins ${min} caractères')
      .max(50, 'Votre nom d\'utilisateur ne doit pas compter plus de ${max} caractères')
      .matches(/^[ 0-9a-zA-ZàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ'`'\-]+$/, "Votre nom d'utilisateur ne doit pas contenir de caractères spéciaux"),
    plainPassword: yup.string()
      .required("Vous devez indiquer un mot de passe")
      .min(8, 'Votre mot de passe doit compter au moins ${min} caractères')
      .max(20, 'Votre mot de passe ne doit pas compter plus de ${max} caractères')
      ,
    plainPassword_confirm: yup.string()
      .oneOf([yup.ref('plainPassword')], "Vous indiquer un mot de passe identique"),
    legal: yup.bool()
      .isTrue("Vous devez accepter les conditions générale d'utilisation")
});

export default schemaValidation;