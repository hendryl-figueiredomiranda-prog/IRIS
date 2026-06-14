package br.com.tatu.apoioamulher.controller;

import br.com.tatu.apoioamulher.database.model.PerguntaEntity;
import br.com.tatu.apoioamulher.dto.PerguntaDto;
import br.com.tatu.apoioamulher.service.PerguntaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/perguntas")
@RequiredArgsConstructor
@Validated
public class PerguntaController {

    private final PerguntaService perguntaService;

    @PostMapping("/formulario/{idFormulario}")
    @ResponseStatus(HttpStatus.CREATED)
    public void criarPergunta(@PathVariable Integer idFormulario, @RequestBody PerguntaDto dto) {
        perguntaService.criarPergunta(idFormulario, dto);
    }

    @GetMapping("/listar")
    @ResponseStatus(HttpStatus.OK)
    public List<PerguntaEntity> listar() {
        return perguntaService.listar();
    }

    @GetMapping("/id/{id}")
    @ResponseStatus(HttpStatus.OK)
    public PerguntaEntity buscarPorId(@PathVariable Integer id) {
        return perguntaService.findyById(id);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void atualizar(@PathVariable Integer id, @RequestBody PerguntaEntity perguntaRequest) {
        perguntaService.atualizarPorId(id, perguntaRequest);
    }

    @DeleteMapping("/id/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletarPorId(@PathVariable Integer id) {
        perguntaService.deleteById(id);
    }
}
