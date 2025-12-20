package vvp_company.requestservice.service;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import vvp_company.requestservice.model.Employee;

@Service
public class CurrentUserService {

    public Employee getCurrentEmployee() {
        ServletRequestAttributes attributes =
                (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
        HttpServletRequest request = attributes.getRequest();

        String employeeIdHeader = request.getHeader("Employee-Id");
        String departmentHeader = request.getHeader("Department");

        if (employeeIdHeader == null || departmentHeader == null) {
            throw new IllegalStateException("Missing required headers: Employee-Id, Department");
        }

        Long employeeId = Long.parseLong(employeeIdHeader);
        return new Employee(employeeId, departmentHeader);
    }
}
