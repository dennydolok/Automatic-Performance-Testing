package main

import (
	"fmt"
	"net/url"
	"os/exec"
	"strconv"
)

func main() {
	var uri string
	var vus string
	duration := "15"
	rps := "1"

	// Scan URL
	for {
		fmt.Println("Enter URL : ")
		fmt.Scanln(&uri)
		_, err := url.ParseRequestURI(uri)
		if err != nil {
			fmt.Println("URL error, gunnakan http:// atau https://")
			fmt.Println(" ")
			continue
		}
		break
	}

	for {
		fmt.Println("Enter VUs : ")
		fmt.Scanln(&vus)
		check, _ := strconv.Atoi(vus)
		if check < 1 {
			fmt.Println("Harus angka dan tidak boleh dibawah 1")
			fmt.Println(" ")
			continue
		}
		fmt.Println("valid")
		break
	}

	fmt.Println("Running performance test...")
	cmd := exec.Command("k6", "run", "-e", "URL="+uri, "-e", "DURATION="+duration, "/Lib/performance-test.js")
	output, err := cmd.CombinedOutput()
	if err != nil {
		fmt.Println(err)
		fmt.Printf("Output: %s\n", output)
		return
	}
	fmt.Println(string(output))

	fmt.Println("Running load test...")
	cmd = exec.Command("k6", "run", "-e", "URL="+uri, "-e", "DURATION="+duration, "-e", "VUS="+vus, "-e", "RPS="+rps, "/Lib/load-test.js")
	output, err = cmd.CombinedOutput()
	if err != nil {
		fmt.Println(err)
		fmt.Printf("Output: %s\n", output)
		return
	}
	fmt.Println(string(output))
	fmt.Println("Tests completed, press enter to exit the program")
	fmt.Scanln()
}
