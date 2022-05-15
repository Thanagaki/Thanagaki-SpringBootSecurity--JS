package ru.kata.spring.boot_security.demo.controllers;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api")
public class RestController1 {

    private final RoleService roleService;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public RestController1(UserService userService, RoleService roleService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.roleService = roleService;
        this.passwordEncoder = passwordEncoder;
    }


    @GetMapping("/users")
    public ResponseEntity<List<User>> allUsers() {
        return new ResponseEntity<>(userService.getAllUsers(), HttpStatus.OK);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> userById(@PathVariable long id) {
        return new ResponseEntity<>(userService.getById(id), HttpStatus.OK);
    }


    @PostMapping("/users")
    public  ResponseEntity<User> addUser(@RequestBody User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userService.saveUser(user);
        return new ResponseEntity<>(userService.getById(user.getId()),HttpStatus.OK);
    }


    @DeleteMapping("/users/{id}")
    public ResponseEntity<List<User>> deleteUser(@PathVariable long id) {
        userService.deleteById(id);
        return new ResponseEntity<>(userService.getAllUsers(), HttpStatus.OK);
    }


    @PutMapping("/users/{id}")
    public  ResponseEntity<User> editUser(@RequestBody User user, @PathVariable long id) {
        userService.edit(user);
        return new ResponseEntity<>(userService.getById(id),HttpStatus.OK);
    }

    @GetMapping("/users/header")
    public ResponseEntity<User> getAuthentication(Authentication authentication) {
        User user = userService.findByUserName(authentication.getName());
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @GetMapping("/user")
    public ResponseEntity<User> showUser(Authentication authentication) {
        return new ResponseEntity<>(userService.findByUserName(authentication.getName()), HttpStatus.OK);
    }

    @GetMapping("/users/roles")
    public ResponseEntity<List<Role>> getAllRoles() {
        return new ResponseEntity <>(roleService.getAllRoles(), HttpStatus.OK);
    }
}



