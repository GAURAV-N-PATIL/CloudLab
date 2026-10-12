package cloudlab_backend.dto;
import java.util.Locale;

// Emails are stored and looked up trimmed and lower-cased, so "Ann@X.com " and "ann@x.com" are one account.
public final class Emails {
    private Emails() {
    }
    public static String normalizeEmail(String email) {
        return email == null ? null : email.trim().toLowerCase(Locale.ROOT);
    }
}
