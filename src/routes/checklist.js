const express = require("express");
const router = express.Router();

const Checklist = require("../models/checklist");

router.get("/", async (req, res) => {
  try {
    const checklist = await Checklist.find({});
    res.status(200).render('checklists/index', { checklist : checklist})
  } catch (error) {
    res.status(500).render('pages/error', { error: 'Erro ao exibir as Listas'});
  }
});

router.get('/new', async (req, res) =>{
try {
  const checklist = new Checklist();
  res.status(200).render('checklists/new', { checklist: checklist})
} catch (error) {
  res.status(500).render('pages/error', {error: 'Erro ao carregar o formulário.'})
}
})

router.get('/:id/edit', async (req, res) =>{
  try {
    const checklist = await Checklist.findById(req.params.id);
    res.status(200).render('checklists/edit', { checklist: checklist});
  } catch (error) {
    res.status(500).render('pages/error', {error: 'Erro ao exibir a edição de lista de tarefas.'})
  }
})

router.post("/", async (req, res) => {
  const { name } = req.body.checklist;
  const checklist = new Checklist({ name })
  try {
    await checklist.save();
    res.redirect('/checklists')
  } catch (error) {
    res.status(422).render('checklists/new', { checklist: {...checklist, error}});
  }
});

router.get("/:id", async (req, res) => {
  try {
    const checklist = await Checklist.findById(req.params.id).populate('tasks');
    res.status(200).render('checklists/show', { checklist: checklist})
  } catch (error) {
    res.status(500).render('pages/error', { error: 'Erro ao exibir as listas de tarefas'});
  }
});

router.put("/:id", async (req, res) => {
  const { name } = req.body.checklist;
  const checklist = await Checklist.findById(req.params.id);

  try {
    await checklist.updateOne({ name });
    res.redirect('/checklists');
  } catch (error) {
    const errors = error.erros;
    res.status(422).render('checklists/edit', { checklist: {...checklist, errors}});
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Checklist.findByIdAndRemove(req.params.id);
    res.redirect('/checklists')
  } catch (error) {
    res.status(500).render('pages/error', { error: 'Erro ao deletar a lista de tarefas'});
  }
});

module.exports = router;