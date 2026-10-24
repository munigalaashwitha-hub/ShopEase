package com.shopease.shopease;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController{

    @GetMapping("/")
    public String home(){
        return "Welcome to ShopEase Fashion Store!";
    }
}

