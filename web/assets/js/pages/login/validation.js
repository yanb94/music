import * as yup from "yup";

const schemaValidation = yup.object().shape({
    username: yup.string().required("Vous devez indiquez un nom d'utilisateur"),
    password: yup.string().required("Vous devez indiquer un mot de passe")
})

export default schemaValidation;