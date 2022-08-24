import FormConfig from "@app/form/formBuilder/configBuilder";

const formFields = FormConfig.build([
    FormConfig.addImageInput()
        .setId("imageFile")
        .setLabel("Courverture")
        .setPlaceholder("Indiquer la couverture de la chanson"),
    FormConfig.addTextInput()
        .setId("name")
        .setLabel("Entrez le nom de la chanson")
        .setPlaceholder("Entrez le nom de la chanson"),
    FormConfig.addSeparator()  
])

export default formFields