package br.com.carrawave.appapi.playback;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "play_session")
@Getter
@Setter
@NoArgsConstructor
public class PlaySession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "public_id", nullable = false, unique = true)
    private UUID publicId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "device_id", nullable = false)
    private Long deviceId;

    @Column(name = "station_id", nullable = false)
    private Long stationId;

    private String source;

    @Column(name = "started_at", nullable = false)
    private Instant startedAt;

    @Column(name = "last_heartbeat_at")
    private Instant lastHeartbeatAt;

    @Column(name = "ended_at")
    private Instant endedAt;

    @Column(name = "played_seconds", nullable = false)
    private int playedSeconds = 0;

    @Column(name = "end_reason")
    private String endReason;
}
