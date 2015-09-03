package br.gov.servicos.editor.frontend;

import com.github.slugify.Slugify;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import static java.util.Optional.empty;
import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verifyNoMoreInteractions;

@RunWith(MockitoJUnitRunner.class)
public class SiorgTest {

    Siorg siorg;

    @Mock
    RestTemplate restTemplate;

    @Before
    public void setUp() throws Exception {
        siorg = new Siorg(restTemplate, new Slugify());
    }

    @Test
    public void retornaEmptyQuandoUrlInvalida() throws Exception {
        String urlOrgao = "http://evil.cracking.attempt.example.com";

        verifyNoMoreInteractions(restTemplate);

        assertThat(siorg.slugDoOrgao(urlOrgao), is(empty()));
    }

    @Test
    public void retornaEmptyQuandoSiorgIndisponivel() throws Exception {
        String urlOrgao = "http://estruturaorganizacional.dados.gov.br/doc/unidade-organizacional/404";

        given(restTemplate.getForEntity(urlOrgao, Siorg.Orgao.class))
                .willThrow(new RuntimeException("Connection refused"));

        assertThat(siorg.slugDoOrgao(urlOrgao), is(empty()));
    }

    @Test
    public void retornaEmptyQuandoOrgaoNaoExiste() throws Exception {
        String urlOrgao = "http://estruturaorganizacional.dados.gov.br/doc/unidade-organizacional/404";

        given(restTemplate.getForEntity(urlOrgao, Siorg.Orgao.class))
                .willReturn(new ResponseEntity<>(new Siorg.Orgao().withServico(new Siorg.Servico().withCodigoErro(102).withMensagem("Unidade não existe")).withUnidade(null), HttpStatus.OK));

        assertThat(siorg.slugDoOrgao(urlOrgao), is(empty()));
    }

    @Test
    public void retornaSlugDoOrgao() throws Exception {
        String urlOrgao = "http://estruturaorganizacional.dados.gov.br/doc/unidade-organizacional/1934";

        given(restTemplate.getForEntity(urlOrgao, Siorg.Orgao.class))
                .willReturn(new ResponseEntity<>(new Siorg.Orgao().withServico(new Siorg.Servico().withCodigoErro(0)).withUnidade(new Siorg.Unidade().withNome("Secretaria do Secretariado Secretarial").withSigla("SSS")), HttpStatus.OK));

        assertThat(siorg.slugDoOrgao(urlOrgao).get(), is("secretaria-do-secretariado-secretarial-sss"));
    }

}