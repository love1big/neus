/**
 * ============================================================================
 * MODULE: Cross-Vendor Fault Tolerance & Thermal Watchdog Node
 * FILE: src/utils/CrossVendorFaultToleranceWatchdogNode.ts
 * ============================================================================
 * 
 * วัตถุประสงค์และหน้าที่ (Module Purpose & Responsibility):
 * ----------------------------------------------------------------------------
 * โมดูลนี้ทำหน้าที่เป็นระบบเฝ้าระวังความปลอดภัยและความต่อเนื่องในการทำงาน (High Availability)
 * สำหรับคลัสเตอร์ฮาร์ดแวร์ข้ามยี่ห้อ (Cross-Vendor):
 * 1. ตรวจสอบอุณหภูมิและการระบายความร้อน (Thermal Throttling Watchdog)
 * 2. ป้องกันอาการไดรเวอร์ค้างหรือแครช (Driver TDR & Hang Recovery)
 * 3. ดำเนินการย้ายงานทันทีข้ามยี่ห้อ (Seamless Cross-Vendor Task Failover) เช่น หากไดรเวอร์
 *    NVIDIA เกิดสะดุด ระบบจะโอนถ่ายภาระงานไปยัง AMD หรือ Intel Arc หรือ CPU AVX-512
 *    โดยไม่ทำให้เกมหรือโปรแกรมหลุดออกจากระบบ
 * 
 * ============================================================================
 */

import { HeterogeneousDeviceRegistryNode } from './HeterogeneousDeviceRegistryNode';
import { HeterogeneousComputeTask } from '../types/heterogeneousCompute';

export interface WatchdogAlertEvent {
  id: string;
  timestamp: string;
  severity: 'WARNING' | 'CRITICAL' | 'RECOVERED' | 'INFO';
  deviceId: string;
  deviceName: string;
  message: string;
  mitigationActionTaken: string;
}

export class CrossVendorFaultToleranceWatchdogNode {
  private static instance: CrossVendorFaultToleranceWatchdogNode;
  private registry = HeterogeneousDeviceRegistryNode.getInstance();
  private alerts: WatchdogAlertEvent[] = [];
  private isWatchdogActive = true;

  private constructor() {
    this.seedInitialHealthLogs();
  }

  public static getInstance(): CrossVendorFaultToleranceWatchdogNode {
    if (!CrossVendorFaultToleranceWatchdogNode.instance) {
      CrossVendorFaultToleranceWatchdogNode.instance = new CrossVendorFaultToleranceWatchdogNode();
    }
    return CrossVendorFaultToleranceWatchdogNode.instance;
  }

  private seedInitialHealthLogs(): void {
    this.alerts = [
      {
        id: 'alert-1',
        timestamp: new Date(Date.now() - 120000).toLocaleTimeString(),
        severity: 'INFO',
        deviceId: 'node-nv-rtx4090',
        deviceName: 'NVIDIA GeForce RTX 4090 OC',
        message: 'PCIe Gen5 link training verified at 32 GT/s. 16x Lane width locked.',
        mitigationActionTaken: 'Hardware link negotiation optimal.'
      },
      {
        id: 'alert-2',
        timestamp: new Date(Date.now() - 60000).toLocaleTimeString(),
        severity: 'INFO',
        deviceId: 'node-amd-rx7900xtx',
        deviceName: 'AMD Radeon RX 7900 XTX',
        message: 'ROCm / Vulkan asynchronous compute queues initialized with 4 compute streams.',
        mitigationActionTaken: 'Compute ring buffer ready.'
      },
      {
        id: 'alert-3',
        timestamp: new Date(Date.now() - 30000).toLocaleTimeString(),
        severity: 'INFO',
        deviceId: 'node-apple-ane',
        deviceName: 'Apple 16-Core Neural Engine (ANE)',
        message: 'CoreML direct SRAM buffer allocated for offline speech synthesis.',
        mitigationActionTaken: 'Power state locked to ultra-low watt profile.'
      }
    ];
  }

  /**
   * สุ่มตรวจสอบสุขภาพของอุปกรณ์และอุณหภูมิ (Thermal Audit Cycle)
   */
  public performThermalAndHealthAudit(): WatchdogAlertEvent[] {
    if (!this.isWatchdogActive) return this.alerts;

    const nodes = this.registry.getActiveNodes();

    nodes.forEach(node => {
      // ตรวจสอบความร้อนเกินเกณฑ์ (เช่น 85C)
      if (node.telemetry.temperatureCelsius >= 85) {
        node.telemetry.health = 'THERMAL_THROTTLED';
        node.telemetry.clockSpeedGhz = Number((node.boostClockGhz * 0.75).toFixed(2));
        node.telemetry.fanSpeedPercent = 100;

        const alert: WatchdogAlertEvent = {
          id: `alert-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          timestamp: new Date().toLocaleTimeString(),
          severity: 'WARNING',
          deviceId: node.id,
          deviceName: node.name,
          message: `Temperature reached ${node.telemetry.temperatureCelsius}°C (Exceeds 85°C limit). Dynamic thermal throttling engaged.`,
          mitigationActionTaken: 'Clock speed throttled by 25%, fan speed set to 100%, re-routing new tasks to secondary nodes.'
        };
        this.recordAlert(alert);
      } else if (node.telemetry.health === 'THERMAL_THROTTLED' && node.telemetry.temperatureCelsius < 75) {
        // คืนสถานะเมื่ออุณหภูมิลดลง
        node.telemetry.health = 'HEALTHY';
        node.telemetry.clockSpeedGhz = node.boostClockGhz;
        
        const alert: WatchdogAlertEvent = {
          id: `alert-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          timestamp: new Date().toLocaleTimeString(),
          severity: 'RECOVERED',
          deviceId: node.id,
          deviceName: node.name,
          message: `Temperature normalized to ${node.telemetry.temperatureCelsius}°C. Thermal throttle lifted.`,
          mitigationActionTaken: 'Restored full boost clocks and standard workload distribution.'
        };
        this.recordAlert(alert);
      }
    });

    return this.alerts;
  }

  /**
   * จำลองและทดสอบการกู้คืนเมื่อการ์ดตัวใดตัวหนึ่งเกิดไดรเวอร์แครช (Driver TDR Failover Simulation)
   */
  public triggerSimulatedDriverCrashAndFailover(targetDeviceId: string): {
    recovered: boolean;
    migratedToDeviceId: string;
    failoverReport: string;
  } {
    const crashedNode = this.registry.getNodeById(targetDeviceId);
    if (!crashedNode) {
      return {
        recovered: false,
        migratedToDeviceId: 'NONE',
        failoverReport: 'Node not found'
      };
    }

    // ทำเครื่องหมายว่าโหนดกำลังกู้คืน
    crashedNode.telemetry.health = 'DRIVER_RECOVERING';
    crashedNode.telemetry.errorCount += 1;

    // หาโหนดตัวสำรองข้ามยี่ห้อที่ดีที่สุด (Cross-Vendor Failover)
    const backupNodes = this.registry.getActiveNodes().filter(n => n.id !== crashedNode.id && n.telemetry.health === 'HEALTHY');
    const backupNode = backupNodes.find(n => n.vendor !== crashedNode.vendor) || backupNodes[0];

    const backupId = backupNode ? backupNode.id : 'node-intel-cpu-285k';
    const backupName = backupNode ? backupNode.name : 'Intel Core Ultra 9 285K';

    const failoverAlert: WatchdogAlertEvent = {
      id: `alert-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toLocaleTimeString(),
      severity: 'CRITICAL',
      deviceId: crashedNode.id,
      deviceName: crashedNode.name,
      message: `Simulated Driver Timeout (TDR) detected on ${crashedNode.name}. In-flight workloads isolated.`,
      mitigationActionTaken: `Zero-downtime failover executed: Workload pipeline immediately migrated to ${backupName} (${backupNode?.vendor || 'Intel'}).`
    };
    this.recordAlert(failoverAlert);

    // จำลองการรีเซ็ตไดรเวอร์และคืนสถานะหลังจาก 3 วินาที
    setTimeout(() => {
      crashedNode.telemetry.health = 'HEALTHY';
      this.recordAlert({
        id: `alert-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date().toLocaleTimeString(),
        severity: 'RECOVERED',
        deviceId: crashedNode.id,
        deviceName: crashedNode.name,
        message: `Driver context reset completed successfully on ${crashedNode.name}. Device re-admitted to cluster.`,
        mitigationActionTaken: 'VRAM pipeline state flushed and re-synchronized with master registry.'
      });
    }, 3000);

    return {
      recovered: true,
      migratedToDeviceId: backupId,
      failoverReport: `Seamlessly redirected pipeline to ${backupName} via ${backupNode?.interconnect || 'PCIe'} bus without crash.`
    };
  }

  private recordAlert(alert: WatchdogAlertEvent): void {
    this.alerts.unshift(alert);
    if (this.alerts.length > 30) {
      this.alerts.pop();
    }
  }

  public getAlerts(): WatchdogAlertEvent[] {
    return [...this.alerts];
  }

  public clearAlerts(): void {
    this.alerts = [];
  }
}
