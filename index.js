const express = require('express')
const MP3Tag = require('mp3tag.js')
const fs = require('fs')

const app = express()
const port = 3000

app.use(express.static('public'))


// app.get('/name/:filename', (req, res) => {

//     const filename = req.params.filename

//     const buffer = fs.readFileSync(`public/${filename}.mp3`)

//     const verbose = true // Logs all processes using `console.log`
//     const mp3tag = new MP3Tag(buffer, verbose)

//     // Read the tags from the buffer
//     mp3tag.read()

//     res.send(mp3tag.tags)
// })


app.get('/', (req, res) => {

    const songlist = []

    const dir = 'public'
    const files = fs.readdirSync(dir)
    console.log(files)

    for (const file of files) {
        console.log(file)
        const buffer = fs.readFileSync(`public/${file}`)
        const verbose = true // Logs all processes using `console.log`
        const mp3tag = new MP3Tag(buffer, verbose)

        // Read the tags from the buffer
        mp3tag.read()

        // Handle error if there's any
        if (mp3tag.error !== '') throw new Error(mp3tag.error)

        // Please see `Tags and Frames`
        songlist.push(mp3tag.tags)
    }
    
    res.send(songlist)
})


app.post('/update', (req, res) => {

    const title = req.body.title
    const artist = req.body.artist
    const date = req.body.date
    const album = req.body.album

    const buffer = fs.readFileSync('public/audio/name.mp3')

    const verbose = true // Logs all processes using `console.log`
    const mp3tag = new MP3Tag(buffer, verbose)

    if (mp3tag.error !== '') throw new Error(mp3tag.error)

    // use the newTag to update the tags and save.
    mp3tag.tags.title = title
    mp3tag.tags.artist = artist
    mp3tag.tags.album = album

    mp3tag.save() // Saves the new changes

    console.log('Tag changed successfully')
})


app.listen(port, () => {
    console.log(`Demo audio app listening on port ${port}`)
  })
