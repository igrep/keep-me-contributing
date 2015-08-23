package info.igreque.keepmecontributing.github;

import java.io.IOException;
import java.lang.Exception;

import java.util.HashMap;
import java.io.InputStream;

import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import org.w3c.dom.NamedNodeMap;

import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathFactory;

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

  public HttpResponse fetchContributionsCalendarSvg() throws IOException{
    return httpClient
      .execute(new HttpGet("https://github.com/users/" + username + "/contributions"));
  }

  public HashMap<String, Contributions> contributionsCalendarFromSvg(InputStream input)
    throws ContributionsCalendarException
  {
    try {
      Document doc =
        DocumentBuilderFactory
        .newInstance()
        .newDocumentBuilder()
        .parse(input);

      NodeList days =
        (NodeList) XPathFactory
        .newInstance()
        .newXPath()
        .evaluate("//rect[@class='day']", doc, XPathConstants.NODESET);

      HashMap<String, Contributions> result = new HashMap<>();
      for(int i = 0; i < days.getLength(); ++i){
        NamedNodeMap attributes = days.item(i).getAttributes();
        String dayString = attributes.getNamedItem("data-date").getNodeValue();
        int count = Integer.parseInt(attributes.getNamedItem("data-count").getNodeValue(), 10);
        Contributions contributions = new Contributions(count);

        result.put(dayString, contributions);
      }
      return result;

    } catch (Exception e) {
      e.printStackTrace();
      String message = "An error occurred while parsing a response from github.com: " + e.toString();
      throw new ContributionsCalendarException(message, e);
    }
  }

}
