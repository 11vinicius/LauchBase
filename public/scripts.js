const Mask = {
    apply(input, func) {
        setTimeout(function() {
            input.value = Mask[func](input.value)
        }, 1)
    },
    formatBRL(value) {
        value = value.replace(/\D/g, "")

        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value / 100)
    },
    cpfCnpj(value) {
        value = value.replace(/\D/g, "")

        if (value.length > 14)
            value = value.slice(0, -1)

        if (value.length > 11) {
            value = value.replace(/(\d{2})(\d)/, "$1.$2")
            value = value.replace(/(\d{3})(\d)/, "$1.$2")
            value = value.replace(/(\d{3})(\d)/, "$1/$2")
            value = value.replace(/(\d{4})(\d)/, "$1-$2")
        } else {
            value = value.replace(/(\d{3})(\d)/, "$1.$2")
            value = value.replace(/(\d{3})(\d)/, "$1.$2")
            value = value.replace(/(\d{3})(\d)/, "$1-$2")
        }
        return value
    },
    cep(value) {
        //78.135-619
        value = value.replace(/\D/g, "")

        if (value.length > 8)
            value = value.slice(0, -1)

        value = value.replace(/(\d{5})(\d)/, "$1-$2")

        return value
    }
}

const PhotosUpload = {
    input: [],
    preview: document.querySelector('#photos-preview'),
    uploadLimit: 6,
    files: [],
    handleFileInput(event) {
        const { files: fileList } = event.target
        PhotosUpload.input = event.target

        if (PhotosUpload.haslimit(event)) return


        Array.from(fileList).forEach(file => {
            const reader = new FileReader()

            PhotosUpload.files.push(file)

            reader.onload = () => {
                const image = new Image()

                image.src = String(reader.result)

                const div = PhotosUpload.getcontainer(image)

                PhotosUpload.preview.appendChild(div)
            }
            reader.readAsDataURL(file)
        })

        PhotosUpload.input.files = PhotosUpload.getAllFiles()
    },
    getcontainer(image) {
        const div = document.createElement('div')
        div.classList.add('photo')

        div.onclick = PhotosUpload.removePhoto

        div.appendChild(image)

        div.appendChild(PhotosUpload.getRemoveButton())

        return div

    },
    haslimit(event) {
        const { uploadLimit, input } = PhotosUpload
        const { files: fileList } = input

        if (fileList.length > uploadLimit) {
            alert(`Envie no máximo ${uploadLimit} fotos`)
            event.preventDefault()
            return true
        }

        const photoDiv = []
        this.preview.childNodes.forEach(item => {
            if (item.classList && item.classList.value == "photo")
                photoDiv.push(item)
        })

        const totalPhotos = fileList.length + photoDiv.length
        if (totalPhotos > uploadLimit) {
            alert("Voce atingiu o limit máximo de fotos")
            event.preventDefault()
            return true
        }

    },
    getAllFiles() {
        const dataTranfer = new ClipboardEvent("").clipboardData || new DataTransfer()

        PhotosUpload.files.forEach(file => dataTranfer.items.add(file))

        return dataTranfer.files
    },
    getRemoveButton() {
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = "close"
        return button
    },
    removePhoto(event) {
        const photoDiv = event.target.parentNode
        const photoArray = Array.from(PhotosUpload.preview.children)
        const index = photoArray.indexOf(photoDiv)

        PhotosUpload.files.splice(index, 1)
        PhotosUpload.input.files = PhotosUpload.getAllFiles()

        photoDiv.remove(index)
    },
    removeOldPhoto(event) {
        const photoDiv = event.target.parentNode

        if (photoDiv.id) {
            const removedFiles = document.querySelector('input[name="removed_files"')
            if (removedFiles) {
                removedFiles.value += `${photoDiv.id},`
            }
        }
        photoDiv.remove()
    }
}

const ImageGallery = {
    highlight: document.querySelector('.gallery .highlight >img'),
    previews: document.querySelectorAll('.gallery-preview img'),
    setImage(e) {
        const { target } = e

        ImageGallery.previews.forEach(preview => preview.classList.remove('active'))
        target.classList.add('active')

        ImageGallery.highlight.src = target.src
    }

}

const Lightbox = {
    target: document.querySelector('.lightbox-target'),
    image: document.querySelector('.lightbox-target img'),
    closeButton: document.querySelector('.lightbox-target a.lightbox-close'),
    open() {
        Lightbox.target.style.opacity = 1
        Lightbox.target.style.top = 0
        Lightbox.target.style.bottom = 0
        Lightbox.closeButton.style.top = 0
    },
    close() {
        Lightbox.target.style.opacity = 0
        Lightbox.target.style.top = "-100%"
        Lightbox.target.style.bottom = "initial"
        Lightbox.closeButton.style.top = "-80px"
    }
}

const validate = {
    apply(input, func) {
        validate.clearErros(input)

        let results = validate[func](input.value)
        input.value = results.value

        if (results.error)
            validate.displayError(input, results.error)

    },
    displayError(input, error) {
        const div = document.createElement('div')
        div.classList.add('error')
        div.innerHTML = error
        input.parentNode.appendChild(div)
        input.focus()

    },
    clearErros(input) {
        const errorDiv = input.parentNode.querySelector(".error")
        if (errorDiv)
            errorDiv.remove()
    },
    isEmail(value) {
        let error = null
        const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

        if (!value.match(mailFormat))
            error = "Email inválido"

        return {
            error,
            value
        }
    },
    isCpfCnpj(value) {
        let error = null

        const cleanValues = value.replace(/\D/, "")

        if (cleanValues.length > 11 && cleanValues.length !== 14) {
            error = "CNPJ incorreto"
        } else if (cleanValues.length < 12 && cleanValues.length !== 11) {
            error = "CPF inválido"
        }

        return {
            error,
            value
        }
    },
    isCep(value) {
        let error = null
        const cleanValue = value.replace(/\D/, "")

        if (cleanValue.length !== 8) {
            error = "Cep incorreto"
        }
        return {
            error,
            value
        }
    }

}