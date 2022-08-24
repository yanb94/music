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
    FormConfig.addSeparator()
])

export default formFields