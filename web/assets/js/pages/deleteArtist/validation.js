import * as yup from "yup";

const schemaValidation = yup.object().shape({
    id: yup.string()
      .required("Vous devez indiquer un nom d'artiste"),
});

export default schemaValidation;