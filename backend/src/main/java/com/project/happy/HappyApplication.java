package com.project.happy;

import com.project.happy.auth.model.Role;
import com.project.happy.auth.model.User;
import com.project.happy.auth.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class HappyApplication {

    public static void main(String[] args) {
        SpringApplication.run(HappyApplication.class, args);
    }

    // Tạo sẵn 1 student + 1 tutor để login
    @Bean
    CommandLineRunner initUsers(UserRepository userRepository,
                                PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() == 0) {
                User student = new User();
                student.setUsername("sv001");
                student.setPassword(passwordEncoder.encode("123456"));
                student.setFullName("Nguyen Van A");
                student.setEmail("sv001@hcmut.edu.vn");
                student.setStatus("ACTIVE");
                student.setRole(Role.STUDENT);
                userRepository.save(student);

                User tutor = new User();
                tutor.setUsername("tt001");
                tutor.setPassword(passwordEncoder.encode("123456"));
                tutor.setFullName("Tran Thi B");
                tutor.setEmail("tt001@hcmut.edu.vn");
                tutor.setStatus("ACTIVE");
                tutor.setRole(Role.TUTOR);
                userRepository.save(tutor);
            }
        };
    }
}
