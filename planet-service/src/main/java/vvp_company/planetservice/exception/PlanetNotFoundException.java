package vvp_company.planetservice.exception;

public class PlanetNotFoundException extends RuntimeException {
    public PlanetNotFoundException(Long id) {
        super("Planet not found: " + id);
    }
}
