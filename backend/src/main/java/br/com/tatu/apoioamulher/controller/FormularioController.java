package br.com.tatu.apoioamulher.controller;

import br.com.tatu.apoioamulher.database.model.FormularioEntity;
import br.com.tatu.apoioamulher.dto.FormularioDto;
import br.com.tatu.apoioamulher.service.FormularioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/formularios")
@RequiredArgsConstructor
@Validated
public class FormularioController {

    private final FormularioService formularioService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void salvar(@RequestBody FormularioDto dto) {
        formularioService.salvar(dto);
    }

    @GetMapping("/listar")
    @ResponseStatus(HttpStatus.OK)
    public List<FormularioEntity> listar() {
        return formularioService.findAllFormularioEntity();
    }

    @GetMapping("/nome/{nome}")
    @ResponseStatus(HttpStatus.OK)
    public FormularioEntity buscarPorNome(@PathVariable String nome) {
        return formularioService.findByNomeContainingIgnoreCase(nome);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void atualizar(@PathVariable Integer id, @RequestBody FormularioEntity formulario) {
        formularioService.atualizarPorId(id, formulario);
    }

    @DeleteMapping("/id/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletarPorId(@PathVariable Integer id) {
        formularioService.deleteByid(id);
    }

    @DeleteMapping("/nome/{nome}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletarPorNome(@PathVariable String nome) {
        formularioService.deleteByNomeContainingIgnoreCase(nome);
    }
}
