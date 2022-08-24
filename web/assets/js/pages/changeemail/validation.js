import * as yup from "yup";

const schemaValidation = yup.object().shape({
    newEmail: yup.string()
      .required("Vous devez indiquer un email")
      .email("Vous devez indiquer un email valide"),
    newEmail_confirm: yup.string()
      .oneOf([yup.ref('newEmail')], "Vous indiquer un email identique")
});

export default schemaValidation;