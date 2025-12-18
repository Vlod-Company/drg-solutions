package vvp_company.authservice.security;

import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
import java.util.Base64;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;

public class PasswordUtil {
    private static final SecureRandom RANDOM = new SecureRandom();
    private static final int SALT_BYTES = 16;
    private static final int ITERATIONS = 65536;
    private static final int KEY_LENGTH = 256;

    public static String generateSalt() {
        byte[] s = new byte[SALT_BYTES];
        RANDOM.nextBytes(s);
        return Base64.getEncoder().encodeToString(s);
    }

    public static String hashPassword(char[] password, String saltBase64, String pepper) {
        byte[] salt = Base64.getDecoder().decode(saltBase64);
        // combine salt and pepper by appending pepper to password char[] during spec building
        String peppered = pepper == null ? "" : pepper;
        PBEKeySpec spec = new PBEKeySpec((new String(password) + peppered).toCharArray(), salt, ITERATIONS, KEY_LENGTH);
        try {
            SecretKeyFactory skf = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
            byte[] hashed = skf.generateSecret(spec).getEncoded();
            return Base64.getEncoder().encodeToString(hashed);
        } catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
            throw new RuntimeException("Error while hashing a password: " + e.getMessage(), e);
        } finally {
            spec.clearPassword();
        }
    }

    public static boolean verifyPassword(char[] attemptedPassword, String storedHash, String saltBase64, String pepper) {
        String attemptHash = hashPassword(attemptedPassword, saltBase64, pepper);
        return slowEquals(storedHash, attemptHash);
    }

    // constant-time equality check
    private static boolean slowEquals(String a, String b) {
        byte[] aa = a != null ? a.getBytes() : new byte[0];
        byte[] bb = b != null ? b.getBytes() : new byte[0];
        int diff = aa.length ^ bb.length;
        for (int i = 0; i < Math.min(aa.length, bb.length); i++) diff |= aa[i] ^ bb[i];
        return diff == 0;
    }
}
