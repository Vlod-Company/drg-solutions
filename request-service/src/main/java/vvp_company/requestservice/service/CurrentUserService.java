package vvp_company.requestservice.service;

import vvp_company.requestservice.model.Sender;
import org.springframework.stereotype.Service;


/// !!!!!
/// ВНИМАНИЕ: ДАННАЯ РЕАЛИЗАЦИЯ ВРЕМЕННАЯ И ТРЕБУЕТ ПЕРЕСМОТРА
/// !!!!!
@Service
public class CurrentUserService {

    // Заглушка на время разработки
    public Sender getCurrentSender() {
        return new Sender(1L, "Logistics"); // сотрудник 1 из Logistics
    }

    // Раскомментировать, когда появится Spring Security + JWT
    // public Sender getCurrentSender() {
    //     Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    //     CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
    //     return new Sender(userDetails.getEmployeeId(), userDetails.getDepartment());
    // }
}