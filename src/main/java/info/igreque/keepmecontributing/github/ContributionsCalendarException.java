package info.igreque.keepmecontributing.github;

import java.lang.Throwable;

public class ContributionsCalendarException extends RuntimeException {
  ContributionsCalendarException(String message, Throwable t){
    super(message, t);
  }
}
