import FormConfig from "@app/form/formBuilder/configBuilder";

const formFields = FormConfig.build([
    FormConfig.addImageInput()
        .setId("image")
        .setLabel("Avatar")
        .setPlaceholder("Indiquer votre avatar"),
    FormConfig.addTextInput()
        .setId("name")
        .setLabel("Entrez votre nom d'artiste")
        .setPlaceholder("Entrez votre nom d'artiste"),
    FormConfig.addEmailInput()
        .setId("email")
        .setLabel("Email de payement paypal")
        .setPlaceholder("Entrez votre email de paiement"),
    FormConfig.addEmailInput()
        .setId("email_confirm")
        .setLabel("Confirmation de l'email de paiement")
        .setPlaceholder("Confirmez votre email de paiement"),
    FormConfig.addTextareaInput()
        .setId("description")
        .setLabel("Description")
        .setPlaceholder("Entrez votre description"),
    FormConfig.addSeparator()  
])

export default formFields