import FormConfig from "@app/form/formBuilder/configBuilder";

const formFields = FormConfig.build([
    FormConfig.addImageInput()
        .setId("imageFile")
        .setLabel("Courverture")
        .setPlaceholder("Indiquer la couverture de la playlist"),
    FormConfig.addTextInput()
        .setId("name")
        .setLabel("Entrez le nom de la playlist")
        .setPlaceholder("Entrez le nom de la playlist"),
    FormConfig.addSongListInput()
        .setLabel('Chansons')
        .setName('songs'),
    FormConfig.addCheckbox()
        .setId('isPublic')
        .setLabel('Rendre cette playlist public'),
    FormConfig.addSeparator()  
])

export default formFields