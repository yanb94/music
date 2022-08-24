import FormConfig from "@app/form/formBuilder/configBuilder";

const formFields = FormConfig.build([
    FormConfig.addEmailInput()
        .setId("newEmail")
        .setLabel("Nouvel email")
        .setPlaceholder("Entrez votre nouvel email"),
    FormConfig.addEmailInput()
        .setId("newEmail_confirm")
        .setLabel("Confirmer le nouvel email")
        .setPlaceholder('Confirmer votre nouvel email'),
    FormConfig.addSeparator()
])

export default formFields;