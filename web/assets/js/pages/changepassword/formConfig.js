import FormConfig from "@app/form/formBuilder/configBuilder";

const formFields = FormConfig.build([
    FormConfig.addPasswordInput()
        .setId("oldPassword")
        .setLabel("Mot de passe actuel")
        .setPlaceholder("Entrez votre mot de passe actuel"),
    FormConfig.addSeparator(),
    FormConfig.addPasswordInput()
        .setId("plainPassword")
        .setLabel("Nouveau mot de passe")
        .setPlaceholder("Entrez votre nouveau mot de passe"),
    FormConfig.addPasswordInput()
        .setId("plainPassword_confirm")
        .setLabel("Confirmer le nouveau mot de passee")
        .setPlaceholder("Confirmer votre nouveau mot de passe"),
    FormConfig.addSeparator()
])

export default formFields