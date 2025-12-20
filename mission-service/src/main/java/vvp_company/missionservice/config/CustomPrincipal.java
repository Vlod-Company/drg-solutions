package vvp_company.missionservice.config;

public class CustomPrincipal {
    public final Long employeeId;
    public final String department;

    public CustomPrincipal(String employeeId, String department) {
        this.employeeId = Long.parseLong(employeeId);
        this.department = department;
    }
}