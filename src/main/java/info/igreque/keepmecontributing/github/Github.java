package info.igreque.keepmecontributing.github;

import java.util.HashMap;

import org.apache.http.client.HttpClient;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Github API client.
 * Get contribution calendar from github.com/users/:username/contributions
 */
public class Github {
  private String username;
  private HttpClient httpClient;

  public Github(String username, HttpClient httpClient){
    this.username = username;
    this.httpClient = httpClient;
  }

  public HashMap<String, Contributions> fetchContributionsCalendar(){
    return null;
  }

  public String fetchContributionsCalendarJson() throws JsonProcessingException {
    ObjectMapper mapper = new ObjectMapper();
    return mapper.writeValueAsString(fetchContributionsCalendar());
  }

  public String fetchContributionsCalendarSvg(){
    return null;
  }

  public HashMap<String, Contributions> contributionsCalendarFromSvg(String string){
    return null;
  }

}
