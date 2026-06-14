package br.com.tatu.apoioamulher.controller;

import br.com.tatu.apoioamulher.database.model.RespostaEntity;
import br.com.tatu.apoioamulher.dto.AvaliacaoRequestDto;
import br.com.tatu.apoioamulher.service.RespostaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/v1/respostas")
@RequiredArgsConstructor
@Validated
public class RespostaController {

    private final RespostaService respostaService;

    @PostMapping("/avaliar")
    @ResponseStatus(HttpStatus.OK)
    public Map<String, Object> avaliarToxicidade(@RequestBody AvaliacaoRequestDto request) {
        return respostaService.calcularToxicidade(request);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RespostaEntity salvar(@RequestBody RespostaEntity resposta) {
        return respostaService.salvar(resposta);
    }

    @GetMapping("/listar")
    @ResponseStatus(HttpStatus.OK)
    public List<RespostaEntity> listar() {
        return respostaService.listar();
    }

    @GetMapping("/id/{id}")
    @ResponseStatus(HttpStatus.OK)
    public RespostaEntity buscarPorId(@PathVariable Integer id) {
        return respostaService.buscarPorId(id);
    }

    @DeleteMapping("/id/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletarPorId(@PathVariable Integer id) {
        respostaService.deletarPorId(id);
    }
}