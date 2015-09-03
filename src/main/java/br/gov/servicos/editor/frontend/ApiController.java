package br.gov.servicos.editor.frontend;

import br.gov.servicos.editor.servicos.Orgao;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Date;
import java.util.List;

import static lombok.AccessLevel.PRIVATE;

@Controller
@FieldDefaults(level = PRIVATE, makeFinal = true)
@RequestMapping("/editar/api")
class ApiController {

    VCGE vcge;
    Orgaos orgaos;

    @Autowired
    public ApiController(VCGE vcge, Orgaos orgaos) {
        this.vcge = vcge;
        this.orgaos = orgaos;
    }

    @RequestMapping("/ping")
    @ResponseBody
    Ping ping(@AuthenticationPrincipal User user) {
        return new Ping(user.getUsername(), new Date().getTime());
    }

    @RequestMapping("/vcge")
    @ResponseBody
    String vcge() {
        return vcge.get();
    }

    @RequestMapping("/orgaos")
    @ResponseBody
    List<Orgao> orgaos(@RequestParam("q") String termo) {
        return orgaos.get(termo);
    }

}
