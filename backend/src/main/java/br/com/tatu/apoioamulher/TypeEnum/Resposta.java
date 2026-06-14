package br.com.tatu.apoioamulher.TypeEnum;

public enum Resposta {
    NUNCA(0),
    ASVEZES(1),
    SEMPRE(2);

    private final int peso;

    Resposta(int peso) {
        this.peso = peso;
    }

    public int getPeso() {
        return peso;
    }
}