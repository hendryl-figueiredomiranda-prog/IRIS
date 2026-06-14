package br.com.tatu.apoioamulher.database.repository;


import br.com.tatu.apoioamulher.database.model.UsuarioEntity;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface UsuarioRepository extends JpaRepository<UsuarioEntity, Integer> {


    Optional<UsuarioEntity> findByEmail(String email);

    Optional<UsuarioEntity> findById(Integer id);

}
