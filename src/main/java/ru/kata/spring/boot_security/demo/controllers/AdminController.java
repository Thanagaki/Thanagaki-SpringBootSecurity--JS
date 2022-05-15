package ru.kata.spring.boot_security.demo.controllers;

import org.hibernate.loader.collection.PaddedBatchingCollectionInitializerBuilder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.security.Principal;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/admin")
public class AdminController {
    private final UserService userService;
    private final RoleService roleService;
    private final PasswordEncoder passwordEncoder;

    public AdminController(UserService userService, RoleService roleService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.roleService = roleService;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping()
    public String adminPage() {
        return "bs-admin-page";
    }


//    @ModelAttribute("user")-указывать это вовсе необязательно поскульку мы в форме передаем *{field} == th:value- это начальное значение
//     input'a, th:name-что указывает на поле user'a и th:id-но мы его не используем
//    Форма POST в теле которой данные о сущности и параметры ("newRoles") с помощью thymeleaf будет засетан user
//     из параметров метода

    @PostMapping()
    public String addUser(User user, @RequestParam("newRoles") String [] roles) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRoles(roleService.getByName(roles));
        userService.saveUser(user);

        return "redirect:/admin";
    }

    @GetMapping("/delete/user/{id}")
    public String deleteUser(@PathVariable(value = "id") Long id) {
        userService.deleteById(id);
        return "redirect:/admin";
    }


    @PostMapping("/edit/user")
    // Здесь сетается юзер
    public String update(User user, @RequestParam("userRoles") String[] roles) {
        if(roles != null) {
            user.setRoles(roleService.getByName(roles));
        } else{
            user.setRoles(userService.getById(user.getId()).getRoles());
        }
        //Если не обновляем, то сетаем тот же самый закодированный пароль иначе сетаем пароль, который ввели
        // и кодируем его
        if ( user.getPassword().equals("")) {
            user.setPassword(userService.getById(user.getId()).getPassword());

        } else {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        userService.edit(user);
        return "redirect:/admin";

    }
}

