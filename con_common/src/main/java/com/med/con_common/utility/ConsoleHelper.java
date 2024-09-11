package com.med.con_common.utility;

import org.fusesource.jansi.Ansi;
import org.fusesource.jansi.AnsiConsole;
import org.slf4j.Logger;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.List;
import java.util.Scanner;


public class ConsoleHelper {
	public static final char YES = 'Y';
	public static final char NO = 'N';

	public static void handleReader(BufferedReader reader, boolean isVerbose) throws IOException {
		String readerStr = "";
		while ((readerStr = reader.readLine()) != null) {
			if (isVerbose) {
				System.out.println(readerStr);
			}
		}
	}

	public static void logIfVerbose(Logger log, String msg, Object... args) {
		if(CommonEnvironmentVariables.getVerbose())
			log.info(msg,args);
	}

	public static void error(String msg) {
		printWithColor(msg, Ansi.Color.RED);
	}

	public static void success(String msg) {
		printWithColor(msg, Ansi.Color.GREEN);
	}

	public static void successNewLine(String msg) {
		printWithColor(msg + "\n", Ansi.Color.GREEN);
	}

	public static void warning(String msg) {
		printWithColor(msg, Ansi.Color.YELLOW);
	}

	public static void printWithColor(String msg, Ansi.Color color) {
		System.out.print(Ansi.ansi().fg(color).a(msg).reset());
	}

	public static void drawProgressBar(int currentValue, int total) {
		int progress = currentValue * 100 / total;
		int barWidth = 40;
		int progressWidth = (int) Math.round((double) progress * barWidth / 100);

		System.out.print("┃");
		for (int i = 0; i < barWidth; i++) {
			if (i <= progressWidth) {
				System.out.print(Ansi.ansi().fg(Ansi.Color.GREEN).a("━").reset());
			} else {
				System.out.print("─");
			}
		}
		System.out.print("┃ " + (progress + 1) + "%\r");
	}

	public static char confirmMessage(String msg) {
		Scanner scanner = new Scanner(System.in);
		System.out.print(msg);
		warning("(Y/n) ");
		String input = scanner.nextLine().trim();
		return input.equalsIgnoreCase("Y") ? YES : NO;
	}

	public static <T> T selectFromList(List<T> list) {
		var scanner = new Scanner(System.in);
		for (int i = 0; i < list.size(); i++) {
			System.out.println((i + 1) + ". " + list.get(i).toString());
		}
		warning("Select a number from the list: ");
		var selectedIndex = Integer.parseInt(scanner.nextLine().trim());
		return list.get(selectedIndex - 1);
	}
}
