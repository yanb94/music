import * as yup from "yup";

const schemaValidation = yup.object().shape({
    name: yup.string()
      .required("Vous devez indiquer un nom")
      .min(2, 'Votre nom doit compter au moins ${min} caractères')
      .max(50, 'Votre nom ne doit pas compter plus de ${max} caractères')
      .matches(/^[ 0-9a-zA-ZàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ'`'\-]+$/, "Votre nom ne doit pas contenir de caractères spéciaux"),
    imageFile: yup.mixed().required('Vous devez indiquer une couverture').test("type","Vous devez indiquer une image",(value) => {
        return value && ['image/jpeg','image/png'].includes(value[0]?.type)
    }).test("size","Votre image doit faire moins de 2 Mo", (value) => {
        return value && value[0]?.size <= 2000000
    }),
    songFile: yup.mixed().required('Vous devez indiquer une chanson').test("type","Vous devez indiquer une chanson",(value) => {
        return value && ['audio/mpeg'].includes(value[0]?.type)
    }).test("size","Votre chanson doit faire moins de 10 Mo", (value) => {
        return value && value[0]?.size <= 10000000
    })
});

export default schemaValidation;