import * as yup from "yup";

const schemaValidation = yup.object().shape({
    oldPassword: yup.string()
      .required("Vous devez indiquer votre ancien mot de passe")
    ,
    plainPassword: yup.string()
      .required("Vous devez indiquer un mot de passe")
      .min(8, 'Votre mot de passe doit compter au moins ${min} caractères')
      .max(20, 'Votre mot de passe ne doit pas compter plus de ${max} caractères')
      ,
    plainPassword_confirm: yup.string()
      .oneOf([yup.ref('plainPassword')], "Vous indiquer un mot de passe identique")
});

export default schemaValidation;