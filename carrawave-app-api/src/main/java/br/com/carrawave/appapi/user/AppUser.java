package br.com.carrawave.appapi.user;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "app_user")
@Getter
@Setter
@NoArgsConstructor
public class AppUser {

    public static final String ANONYMOUS = "ANONYMOUS";
    public static final String REGISTERED = "REGISTERED";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "public_id", nullable = false, unique = true)
    private UUID publicId;

    @Column(name = "account_type", nullable = false)
    private String accountType;

    @Column(unique = true)
    private String email;

    @Column(name = "password_hash")
    private String passwordHash;

    @Column(name = "display_name")
    private String displayName;

    @Column(name = "oauth_provider")
    private String oauthProvider;

    @Column(name = "oauth_subject")
    private String oauthSubject;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "last_seen_at")
    private Instant lastSeenAt;

    public boolean isAnonymous() {
        return ANONYMOUS.equals(accountType);
    }
}
