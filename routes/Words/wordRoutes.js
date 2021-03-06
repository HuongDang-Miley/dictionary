const router = require('express').Router()
const { route } = require('..');
const Word = require('./models/Words')

router.get('/get-words', ((req, res) => {
    Word.find()
        .then((foundWords) => { return res.render('main/index', { wordsList: foundWords }); })
        .catch(err => res.json({ err }))
}
))

router.post('/add-word', (req, res) => {
    Word.findOne({ word: req.body.word })
        .then((foundWord) => {
            if (foundWord) {
                return res.send("Word Already Exist")
            } else {
                if (!req.body.word || !req.body.meaning) {
                    return res.send("All Inputs Must Be Filled");
                }
                let newWord = new Word({
                    word: req.body.word,
                    meaning: req.body.meaning
                });
                newWord.save()
                    .then((wordCreated) => {
                        return res.redirect('/words/get-words')
                        //return res.status(200).json({ wordCreated })
                    })
                    .catch((err) => {
                        return res.status(400).json({ message: "Word Not Created", err })
                    })
            }
        })
        .catch(err => res.status(500).json({ message: "Server Error", err }))
})

router.get('/add-word', (req, res) => {
    return res.render('main/add-word')
})

router.get('/single-word/:wordId', (req, res) => {
    Word.findById(req.params.wordId)
        .then((dbWord) => {
            if (dbWord) {
                return res.render('main/single-word', { foundWord: dbWord })
            } else {
                return res.status(400).send('No Word Found');
            }
        })
        .catch((err) => {
            return res
                .status(500)
                .json({ confirmation: 'fail', message: 'Server Error', err })
        })
})

router.get('/update/:wordId', (req, res) => {
    Word.findById(req.params.wordId)
        .then((dbWord) => {
            if (!dbWord) {
                return res.status(400).send('No Word Found')
            }
            return res.status(200).render('main/update-word', { foundWord: dbWord })
        })
        .catch((err) => {
            return res.status(500).json({ message: "Server Error", err })
        });
})

router.put('/update/:wordId', (req, res) => {
    Word.findById(req.params.wordId)
        .then((foundWord) => {
            if (!foundWord) {
                return res.status(400).send('No Word Found')
            }
            if (!req.body.meaning) {
                return res.status(400).send('ALl in put must be filled');
            }
            foundWord.meaning = req.body.meaning
            foundWord.save()
                .then(() => {
                    return res.redirect(`/words/single-word/${req.params.wordId}`)
                })
        })
        .catch(err => {
            return res.status(500).json({ message: "Server Error" })
        })
})
router.delete("/delete/:wordId", (req, res) => {
    Word.findByIdAndDelete(req.params.wordId)
        .then((foundWord) => {
            if (!foundWord) {
                return res.status(400).send("word not found")
            }
            return res.status(200).redirect('/words/get-words');
        })
        .catch((err) => {
            return res.status(400).json({ message: 'Server Error', err })
        }
        )
}
)

module.exports = router;