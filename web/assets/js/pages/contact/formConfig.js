import FormConfig from "@app/form/formBuilder/configBuilder";

const formFields = FormConfig.build([
    FormConfig.addTextInput()
        .setId("firstname")
        .setLabel("Prénom")
        .setPlaceholder("Entrez votre nom"),
    FormConfig.addTextInput()
        .setId('lastname')
        .setLabel('Nom')
        .setPlaceholder('Entrez votre prénom'),
    FormConfig.addEmailInput()
        .setId('email')
        .setLabel('Email')
        .setPlaceholder('Entrez votre email'),
    FormConfig.addTextareaInput()
        .setId('message')
        .setLabel('Message')
        .setPlaceholder('Entrez votre message')
])

export default formFields;