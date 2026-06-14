package br.com.tatu.apoioamulher.service;

import br.com.tatu.apoioamulher.TypeEnum.Resposta;
import br.com.tatu.apoioamulher.dto.AvaliacaoRequestDto;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AvaliacaoService {

    public Map<String, Object> calcularToxicidade(AvaliacaoRequestDto request) {

        int pontuacaoTotal = 0;
        for (Resposta escolha : request.getRespostasEscolhidas()) {
            pontuacaoTotal += escolha.getPeso();
        }

        Map<String, Object> resultado = new HashMap<>();
        resultado.put("pontuacaoTotal", pontuacaoTotal);

        if (pontuacaoTotal <= 3) {
            resultado.put("nivelToxicidade", "Relação Aparentemente Saudável");
            resultado.put("orientacao", "Continue atenta aos seus limites.");
        } else if (pontuacaoTotal <= 8) {
            resultado.put("nivelToxicidade", "Sinais de Alerta (Bandeira Amarela)");
            resultado.put("orientacao", "Há comportamentos que merecem atenção.");
        } else {
            resultado.put("nivelToxicidade", "Relação Tóxica / Abusiva (Bandeira Vermelha)");
            resultado.put("orientacao", "Procure apoio ou ligue 180.");
        }

        return resultado;
    }
}