package br.com.carrawave.appapi.user;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "user_settings")
@Getter
@Setter
@NoArgsConstructor
public class UserSettings {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @Column(nullable = false)
    private String theme = "SYSTEM";

    @Column(name = "audio_quality", nullable = false)
    private String audioQuality = "AUTO";

    @Column(nullable = false)
    private boolean autoplay = true;

    @Column(name = "sleep_timer_minutes")
    private Integer sleepTimerMinutes;

    public UserSettings(Long userId) {
        this.userId = userId;
    }
}
