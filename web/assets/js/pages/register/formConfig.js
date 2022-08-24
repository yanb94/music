import FormConfig from "@app/form/formBuilder/configBuilder"

const formFields = FormConfig.build([
    FormConfig.addTextInput()
        .setId('lastname')
        .setLabel('Nom')
        .setPlaceholder('Entrez votre nom'),
    FormConfig.addTextInput()
        .setId('firstname')
        .setLabel('Prénom')
        .setPlaceholder('Entrez votre prénom'),
    FormConfig.addBirthday()
        .setLabel('Date de naissance')
        .setName('birthday'),
    FormConfig.addRadioInput()
        .setId('sexe')
        .setLabel('Sexe')
        .setOptions({
            "m":"Homme",
            "f":"Femme"
        }),
    FormConfig.addSeparator(),
    FormConfig.addEmailInput()
        .setId('email')
        .setLabel('Votre email')
        .setPlaceholder('Entrez votre email'),
    FormConfig.addEmailInput()
        .setId('email_confirm')
        .setLabel("Confirmer l'email")
        .setPlaceholder('Confirmer votre email'),
    FormConfig.addSeparator(),
    FormConfig.addTextInput()
        .setId('username')
        .setLabel("Nom d'utilisateur")
        .setPlaceholder("Entrez votre nom d'utilisateur"),
    FormConfig.addPasswordInput()
        .setId('plainPassword')
        .setLabel('Mot de passe')
        .setPlaceholder('Entrez votre mot de passe'),
    FormConfig.addPasswordInput()
        .setId('plainPassword_confirm')
        .setLabel('Confirmer le mot de passe')
        .setPlaceholder('Confirmer votre mot de passe'),
    FormConfig.addSeparator(),
    FormConfig.addCheckbox()
        .setId('legal')
        .setLabel("J'accepte les conditions générale d'utilisation")
])

export default formFields