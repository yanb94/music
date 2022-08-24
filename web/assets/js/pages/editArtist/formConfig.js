import FormConfig from "@app/form/formBuilder/configBuilder";

const formFields = FormConfig.build([
    FormConfig.addImageInput()
        .setId("image")
        .setLabel("Avatar")
        .setPlaceholder("Changer votre avatar"),
    FormConfig.addTextInput()
        .setId("name")
        .setLabel("Modifier votre nom d'artiste")
        .setPlaceholder("Modifier votre nom d'artiste"),
    FormConfig.addEmailInput()
        .setId("email")
        .setLabel("Modifier l'email de payement paypal")
        .setPlaceholder("Modifier votre email de paiement"),
    FormConfig.addTextareaInput()
        .setId("description")
        .setLabel("Description")
        .setPlaceholder("Modifier votre description"),
    FormConfig.addSeparator()  
])

export default formFields