package br.com.carrawave.appapi.stats;

import br.com.carrawave.appapi.security.AuthenticatedUser;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/stats")
public class StatsController {

    private final PresenceService presenceService;

    public StatsController(PresenceService presenceService) {
        this.presenceService = presenceService;
    }

    /** O app chama a cada ~60 s enquanto está aberto: registra presença e devolve os contadores. */
    @PostMapping("/presence")
    public OnlineStats presence(@AuthenticationPrincipal AuthenticatedUser principal) {
        presenceService.touch(principal.deviceId());
        return presenceService.snapshot();
    }

    @GetMapping("/online")
    public OnlineStats online() {
        return presenceService.snapshot();
    }
}
